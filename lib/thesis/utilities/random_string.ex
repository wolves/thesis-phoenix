defmodule Thesis.Utilities.RandomString do
  @moduledoc """
  Module to generate a random string.
  """

  def random_string(length) do
    length
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64
    |> String.replace("_", "")
    |> String.downcase
    |> binary_part(0, length)
  end
end


