defmodule ThesisControllerTest do
  use ExUnit.Case
  use Phoenix.ConnTest

  doctest Thesis.Controller

  setup do
    page = %Thesis.Page{id: 1, slug: "/dynamic", redirect_url: nil}

    page_contents = [%Thesis.PageContent{
      page_id: 1,
      name: "test",
      content: "Dynamic Page",
      content_type: "text"
    }]

    {:ok, conn: build_conn(), page: page, page_contents: page_contents}
  end

  test "redirects when not in edit mode and redirect_url is set", %{conn: conn, page: page} do
    page = Map.put(page, :redirect_url, "/redirected?test=1")
    conn = test_view_conn(conn, %{thesis_editable: false, thesis_page: page})
    assert redirected_to(conn, 301) == "/redirected?test=1"
  end

  test "renders a dynamic page when redirect_url is not set", %{conn: conn, page: page, page_contents: page_contents} do
    assigns = %{thesis_editable: false, thesis_page: page, thesis_content: page_contents}
    conn = test_view_conn(conn, assigns)
    assert response(conn, 200) == "<h1>  <div id=\"thesis-content-test\" class=\"thesis-content thesis-content-text  \" data-thesis-content-type=\"text\" data-thesis-content-id=\"test\" data-thesis-content-meta=\"\" style=\"\">\n    Dynamic Page\n  </div>\n</h1>\n"
  end

  test "renders a 404 when page not found", %{conn: conn, page: page} do
    page = Map.put(page, :id, nil)
    assigns = %{thesis_editable: false, thesis_page: page, thesis_content: []}
    conn = test_view_conn(conn, assigns, "test.html", not_found: Thesis.TestView)
    assert response(conn, 404) == "Test 404 file not found"
  end

  test "renders a dynamic page with passed-in assigns", %{conn: conn, page: page, page_contents: page_contents} do
    assigns = %{thesis_editable: false, thesis_page: page, thesis_content: page_contents, test_list: [1, 2, 3]}
    conn = test_view_conn(conn, assigns, "test_assigns.html")
    assert response(conn, 200) == "1, 2, 3"
  end

  defp test_view_conn(conn, assigns, template \\ "test.html", opts \\ []) do
    conn
    |> Phoenix.Controller.put_view(Thesis.TestView)
    |> Map.put(:assigns, assigns)
    |> Thesis.TestController.render_dynamic([template: template] ++ opts)
  end
end
