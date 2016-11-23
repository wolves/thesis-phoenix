defmodule Thesis.Utilities.Parameterize do
  @moduledoc """
  Module for slugifying strings.
  """

  def parameterize(str) do
    str = Regex.replace(~r/[^a-z0-9\-\s\.]/i, str, "")
    Regex.split(~r/\%20|\s/, str)
    |> Enum.join("-")
    |> String.downcase
  end
end
