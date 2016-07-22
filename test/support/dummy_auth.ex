defmodule Thesis.DummyAuth do
  def page_is_editable?(conn) do
    conn.assigns[:thesis_editable] == true
  end
end
