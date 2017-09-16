defmodule ExamplePhxWeb.FullFeatureTest do
  use ExamplePhxWeb.ConnCase

  use Hound.Helpers

  # Start a Hound session
  hound_session()


  test "GET /" do
    navigate_to "/"
    assert page_source() =~ "Welcome to Thesis"

    click({:link_text, "Log in"})
    
    logout = find_element(:link_text, "Log out")
    assert element_displayed?(logout)

    thesis = find_element(:id, "thesis-editor")
    assert element_displayed?(thesis)

    save = find_element(:css, ".thesis-button.save")
    refute element_displayed?(save)

    click({:css, ".thesis-button.edit"})

    wait_for(save, :show)

    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    fill_field(jumbotron, "New content here!")

    click(save)

    wait_for(save, :hide)

    refresh_page()

    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    assert inner_html(jumbotron) =~ "<p>New content here!</p>"

    move_to({:css, ".thesis-button.edit"}, 5, 5)

    add = find_element(:css, ".thesis-button.add")
    wait_for(add, :show)
    click(add)

    path = find_element(:css, "input.page-path")
    title = find_element(:css, "input.page-title")
    description = find_element(:css, "textarea.page-description")
    
    wait_for(path, :show)
    
    rand = random_string(32)

    fill_field(path, "/about")
    fill_field(title, "About Us")
    fill_field(description, "Description: #{rand}")

    click({:class, "thesis-tray-save"})

    :timer.sleep(100)

    remove_alerts()

    jumbotron = find_element(:id, "thesis-content-jumbotron-welcome")
    assert inner_html(jumbotron) =~ "<h2>Welcome to Thesis!</h2>"
    assert page_title() == "About Us"
    assert page_source() =~ "<meta name=\"description\" content=\"Description: #{rand}\" />"

    move_to({:css, ".thesis-button.edit"}, 5, 5)

    delete = find_element(:css, ".thesis-button.delete")
    wait_for(delete, :show)
    click(delete)

    :timer.sleep(100)

    refresh_page()

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
    execute_script("window.alert=function (a) {};window.prompt=function (a) {};window.confirm=function (a) {};")
  end
end
