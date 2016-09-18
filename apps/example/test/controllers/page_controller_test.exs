defmodule Example.PageControllerTest do
  use Example.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "This is a global content area"
  end
end
