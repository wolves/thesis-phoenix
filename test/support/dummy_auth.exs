defmodule Thesis.DummyAuth do
  def page_is_editable?(conn) do
    conn.assigns[:editable] == true
  end
end
