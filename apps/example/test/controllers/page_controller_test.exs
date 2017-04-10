defmodule Example.PageControllerTest do
  use Example.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "This is a global content area"
  end

  test "Update and retrieve home page", %{conn: conn} do
    # Check if we have the default content
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "<h4>Help</h4>"

    payload = %{
      "page" => %{"slug" => "/", "title" => "", "description" => "","redirect_url" => nil,"template" => nil},
      "contents" => [%{"name" => "Help","content_type" => "html","content" => "<p>Updated content area</p>", "meta" => "{\"global\":null,\"classes\":\"\"}","global" => nil}]
    }
    conn = put conn, "/thesis/update", payload

    conn = get conn, "/"
    refute html_response(conn, 200) =~ "<h4>Help</h4>"
    assert html_response(conn, 200) =~ "<p>Updated content area</p>"
  end

  test "Update and retrieve about page", %{conn: conn} do
    # Check if we have the default content
    conn = get conn, "/about"
    assert html_response(conn, 200) =~ "<h4>About Thesis</h4>"

    # Updated content
    payload = %{
      "page" => %{"slug" => "/about", "title" => "", "description" => "","redirect_url" => nil,"template" => nil},
      "contents" => [%{"name" => "Resources","content_type" => "html","content" => "<p>Updated content area</p>", "meta" => "{\"global\":null,\"classes\":\"\"}","global" => nil}]
    }
    conn = put conn, "/thesis/update", payload

    # Verify content was updated and default is gone
    conn = get conn, "/about"
    assert html_response(conn, 200) =~ "<p>Updated content area</p>"
    refute html_response(conn, 200) =~ "<h4>About Thesis</h4>"
  end
end
