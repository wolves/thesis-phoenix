defmodule ExamplePhxWeb.LayoutView do
  use ExamplePhxWeb, :view

  def logged_in?(conn) do
    ExamplePhx.Authentication.logged_in?(conn)
  end
end
