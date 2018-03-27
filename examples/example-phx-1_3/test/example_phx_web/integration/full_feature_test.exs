defmodule ExamplePhxWeb.FullFeatureTest do
  use ExamplePhxWeb.IntegrationCase

  test "updates content and reverts to a previous backup" do
    go_to_home_page_and_log_in()

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
    :timer.sleep(100)
    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    assert inner_html(jumbotron) =~ "<p>New content here!</p>"

    # Open the editor, make another edit, save
    click({:css, ".thesis-button.edit"})
    save = find_element(:css, ".thesis-button.save")
    wait_for(save, :show)
    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    fill_field(jumbotron, "Another Edit")
    click(save)
    wait_for(save, :hide)
    refresh_page()
    :timer.sleep(100)

    # Open the editor and apply a previous revision
    click({:css, ".thesis-button.edit"})
    import_export = find_element(:css, ".thesis-button.import-export")
    wait_for(import_export, :show)
    click(import_export)
    :timer.sleep(100)
    first_rev = find_element(:css, "select option:last-child")
    import_button = find_element(:css, "button.thesis-tray-save")
    click(first_rev)
    :timer.sleep(100)
    click(import_button)
    :timer.sleep(300)
    save = find_element(:css, ".thesis-button.save")
    click(save)
    wait_for(save, :hide)

    # Verify that the revision got applied
    refresh_page()
    :timer.sleep(100)
    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    assert inner_html(jumbotron) =~ "New content here!"
  end

  test "creates a new page, then deletes it" do
    go_to_home_page_and_log_in()

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
    scroll_to_element({:class, "thesis-tray-cancel"})
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

  # setup functions
  def go_to_home_page_and_log_in() do
    # Basic home page, not logged in
    navigate_to "/"
    set_window_size(List.first(window_handles()), 1500, 1000)
    assert page_source() =~ "Welcome to Thesis"
    refute page_source() =~ "thesis-editor"

    # Log in
    click({:link_text, "Log in"})
    logout = find_element(:link_text, "Log out")
    assert element_displayed?(logout)
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
