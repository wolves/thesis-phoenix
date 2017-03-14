defmodule Thesis.Utilities do
  @moduledoc """
  Module that provides helper functions.
  """


  def parameterize(str) do
    str = Regex.replace(~r/[^a-z0-9\-\s\.]/i, str, "")
    Regex.split(~r/\%20|\s/, str)
    |> Enum.join("-")
    |> String.downcase
  end

  def random_string(length) do
    length
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64
    |> String.replace("_", "")
    |> String.downcase
    |> binary_part(0, length)
  end

  @doc """
  Takes a URL and strips unnecessary characters.

      iex> Thesis.Utilities.normalize_url("http://infinite.red//ignite//foo")
      "http://infinite.red/ignite/foo"
      iex> Thesis.Utilities.normalize_url("https://infinite.red/ignite/foo/")
      "https://infinite.red/ignite/foo"
  """
  def normalize_url(url) do
    url
    |> String.replace(~r/(?<=[^:])(\/\/)/, "/") # Strip double slashes
    |> String.replace(~r/\/$/, "") # Strip trailing slash
  end
end
