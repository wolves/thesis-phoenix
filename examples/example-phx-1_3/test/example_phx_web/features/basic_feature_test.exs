defmodule ExamplePhxWeb.BasicFeatureTest do
  use ExamplePhxWeb.FeatureCase, async: true

  import Wallaby.Query, only: [css: 2]

  test "users have names", %{session: session} do
    session
    |> visit("/login")
    |> find(css("#thesis-editor", count: 1))
    |> assert_has(css(".thesis-button", count: 4))
  end
end
