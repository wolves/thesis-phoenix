defmodule Thesis.TestView do
  use Phoenix.View, root: "web/templates"
  use Thesis.View

  def render("404.html", _assigns) do
    "Test 404 file not found"
  end
end
