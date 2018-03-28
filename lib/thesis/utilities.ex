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
      iex> parameterize(:this_is_a_test)
      "this-is-a-test"
  """
  def parameterize(str) when is_atom(str) do
    str
    |> Atom.to_string
    |> String.replace("_", " ")
    |> parameterize()
  end
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

  @doc """
  Shorthand `to_string`.

      iex> import Thesis.Utilities
      iex> to_s(000001)
      "1"
      iex> to_s(123)
      "123"
  """
  def to_s(arg), do: to_string(arg)

  @doc """
  Returns the data type for the provided data using guard functions.

      iex> import Thesis.Utilities
      iex> typeof(000001)
      "integer"
      iex> typeof([1,2,3])
      "list"
  """
  @types ~w[function nil integer binary bitstring list map float atom tuple pid port reference]
  for type <- @types do
    def typeof(x) when unquote(:"is_#{type}")(x), do: unquote(type)
  end
end
