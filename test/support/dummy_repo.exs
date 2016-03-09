defmodule Thesis.DummyRepo do
  def all(_) do
    [
      %Thesis.Page{},
      %Thesis.Page{},
      %Thesis.Page{},
      %Thesis.Page{},
    ]
  end
end

