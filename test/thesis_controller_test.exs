defmodule ThesisControllerTest do
  use ExUnit.Case
  use Phoenix.ConnTest

  doctest Thesis.Controller

  setup do
    {:ok, conn: build_conn}
  end

  test "redirects when not in edit mode and redirect_url is set", %{conn: conn} do
    page = %Thesis.Page{id: 1, slug: "/dynamic", redirect_url: "/redirected?test=1"}
    conn =  conn
            |> Phoenix.Controller.put_view(Thesis.TestView)
            |> Map.put(:assigns, %{thesis_editable: false, thesis_page: page})
            |> Thesis.TestController.render_dynamic(template: "test.html")
    assert redirected_to(conn, 301) == "/redirected?test=1"
  end

  test "renders a dynamic page when redirect_url is not set", %{conn: conn} do
    page = %Thesis.Page{id: 1, slug: "/dynamic", redirect_url: nil}
    page_contents = [%Thesis.PageContent{
      page_id: 1,
      name: "test",
      content: "Dynamic Page",
      content_type: "text"
    }]
    conn =  conn
            |> Phoenix.Controller.put_view(Thesis.TestView)
            |> Map.put(:assigns, %{
                thesis_editable: false, thesis_page: page, thesis_content: page_contents})
            |> Thesis.TestController.render_dynamic(template: "test.html")
    assert response(conn, 200) == "<h1>  <div id=\"thesis-content-test\" class=\"thesis-content thesis-content-text  \" data-thesis-content-type=\"text\" data-thesis-content-id=\"test\" data-thesis-content-meta=\"\" style=\"\">\n    Dynamic Page\n  </div>\n</h1>\n"
  end

  test "renders a 404 when page not found", %{conn: conn} do
    page = %Thesis.Page{id: nil, slug: "/dynamic", redirect_url: nil}
    page_contents = []
    conn =  conn
            |> Phoenix.Controller.put_view(Thesis.TestView)
            |> Map.put(:assigns, %{
                thesis_editable: false, thesis_page: page, thesis_content: page_contents})
            |> Thesis.TestController.render_dynamic(template: "test.html", not_found: Thesis.TestView)
    assert response(conn, 404) == "Test 404 file not found"
  end

end
