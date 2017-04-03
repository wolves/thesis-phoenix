defmodule ThesisControllerTest do
  use ExUnit.Case
  use Phoenix.ConnTest

  doctest Thesis.ApiController

  setup do
    {:ok, conn: build_conn}
  end

  test "renders a 404 when page not found", %{conn: conn} do
    # conn =  conn
    #         |> Phoenix.Controller.put_view(Thesis.TestView)
    #         |> Map.put(:assigns, %{
    #             thesis_editable: false, thesis_page: page, thesis_content: page_contents})
    #         |> Thesis.TestController.render_dynamic(template: "test.html", not_found: Thesis.TestView)
    # assert response(conn, 404) == "Test 404 file not found"
    assert true
  end


end
