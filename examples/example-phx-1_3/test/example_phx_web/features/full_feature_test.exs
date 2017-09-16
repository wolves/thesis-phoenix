defmodule ExamplePhxWeb.FullFeatureTest do
  use ExamplePhxWeb.ConnCase

  use Hound.Helpers

  # Start a Hound session
  hound_session()

  test "GET /" do
    # Basic home page, not logged in
    navigate_to "/"
    assert page_source() =~ "Welcome to Thesis"
    refute page_source() =~ "thesis-editor"

    # Log in
    click({:link_text, "Log in"})
    logout = find_element(:link_text, "Log out")
    assert element_displayed?(logout)

    thesis = find_element(:id, "thesis-editor")
    assert element_displayed?(thesis)

    save = find_element(:css, ".thesis-button.save")
    refute element_displayed?(save)

    # Open the editor
    click({:css, ".thesis-button.edit"})
    wait_for(save, :show)

    # Edit the jumbotron
    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    fill_field(jumbotron, "New content here!")

    # Save the page
    click(save)
    wait_for(save, :hide)

    # Refresh and check that the content is still there
    refresh_page()
    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    assert inner_html(jumbotron) =~ "<p>New content here!</p>"

    # Hover over edit, click Add
    move_to({:css, ".thesis-button.edit"}, 5, 5)
    add = find_element(:css, ".thesis-button.add")
    wait_for(add, :show)
    click(add)
    
    # Wait for the tray to show up
    path = find_element(:css, "input.page-path")
    title = find_element(:css, "input.page-title")
    description = find_element(:css, "textarea.page-description")    
    wait_for(path, :show)

    # Test the cancel button
    click({:class, "thesis-tray-cancel"})
    wait_for(path, :hide)

    # Try adding a new page
    move_to({:css, ".thesis-button.edit"}, 5, 5)
    wait_for(add, :show)
    click(add)
    wait_for(path, :show)
    
    # Fill out the new page form
    rand = random_string(32)
    fill_field(path, "/about")
    fill_field(title, "About Us")
    fill_field(description, "Description: #{rand}")

    # Save the new page, let it redirect
    click({:class, "thesis-tray-save"})
    :timer.sleep(100)

    # Don't want confirms popping up when we delete
    remove_alerts()

    # Check the newly created page
    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    assert inner_html(jumbotron) =~ "<h2>Welcome to Thesis!</h2>"
    assert page_title() == "About Us"
    assert page_source() =~ "<meta name=\"description\" content=\"Description: #{rand}\" />"

    # Click the delete button
    move_to({:css, ".thesis-button.edit"}, 5, 5)
    delete = find_element(:css, ".thesis-button.delete")
    wait_for(delete, :show)
    click(delete)

    # Refresh the page
    :timer.sleep(100)
    refresh_page()
    :timer.sleep(100)

    # Should get a 404
    assert page_source() =~ "Page not found"
  end

  # utility functions

  defp wait_for(element, displayed), do: wait_for(element, displayed, 10)
  defp wait_for(element, displayed, 0) do
    # will probably fail
    assert element_displayed?(element) == (displayed == :show)
  end
  defp wait_for(element, displayed, times) do
    if element_displayed?(element) == displayed do
      assert element_displayed?(element) == (displayed == :show)
    else
      :timer.sleep(100)
      wait_for(element, displayed, times - 1)
    end
  end

  defp random_string(length) do
    :crypto.strong_rand_bytes(length) |> Base.encode64 |> binary_part(0, length)
  end

  defp remove_alerts() do
    execute_script("window.alert=function(a){return true};window.prompt=function(a){return true};window.confirm=function(a){return true};")
  end
end
