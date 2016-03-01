defmodule Thesis.Config do
  def store do
    Application.get_env(:thesis, :store)
  end

  def repo do
    Application.get_env(:thesis, Thesis.Store)[:repo]
  end
end
