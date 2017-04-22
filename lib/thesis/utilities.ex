defmodule Thesis.Utilities do
  @moduledoc """
  Module that provides helper functions.
  """


  @doc """
  Removes special characters, keeps dashes and underscores, and replaces spaces
  with dashes. Also downcases the entire string.

      iex> import Thesis.Utilities
      iex> parameterize("Jamon is so cool!")
      "jamon-is-so-cool"
      iex> parameterize("%#d50SDF dfsJ FDS  lkdsf f dfka   a")
      "d50sdf-dfsj-fds--lkdsf-f-dfka---a"
  """
  def parameterize(str) do
    str = Regex.replace(~r/[^a-z0-9\-\s\.]/i, str, "")
    Regex.split(~r/\%20|\s/, str)
    |> Enum.join("-")
    |> String.downcase
  end

  @doc """
  Generates a random string of letters of a given length.

      iex> import Thesis.Utilities
      iex> String.length(random_string(15))
      15
      iex> random_string(15) != random_string(15)
      true
  """
  def random_string(length) do
    length
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64
    |> String.replace(~r/[^0-9a-zA-Z]+/, "")
    |> String.downcase
    |> binary_part(0, length)
  end

  @doc """
  Generates a random string of digits of a given length.

      iex> import Thesis.Utilities
      iex> String.length(random_string(15, :numeric))
      15
      iex> random_string(15, :numeric) != random_string(15, :numeric)
      true
      iex> String.to_integer(random_string(15, :numeric)) > 0
      true
  """
  def random_string(length, :numeric) do
    length
    |> :crypto.strong_rand_bytes
    |> :crypto.bytes_to_integer
    |> Integer.to_string
    |> binary_part(0, length)
  end

  @doc """
  Takes a URL and strips unnecessary characters.

      iex> import Thesis.Utilities
      iex> normalize_path("//ignite//foo")
      "/ignite/foo"
      iex> normalize_path("/ignite/foo/")
      "/ignite/foo"
      iex> normalize_path("/")
      "/"
  """
  def normalize_path("/"), do: "/"
  def normalize_path(path) do
    path
    |> String.replace("//", "/")
    |> String.replace_trailing("/", "")
  end

  def to_s(arg), do: to_string(arg)
end
