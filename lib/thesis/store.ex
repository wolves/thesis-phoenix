defmodule Thesis.Store do
  @moduledoc """
  Thesis.Store is an Elixir "behaviour" that defines the public function
  interface necessary for Thesis to use a particular store module.

  There are currently five required functions, as described below.
  """

  @doc """
  Returns all pages currently in the database, as a list of Thesis.Page
  structs. Will return an empty list if none are found.
  """
  @callback pages() :: %{String.t => Thesis.Page.t}

  @doc """
  Returns a Thesis.Page struct with the given slug (aka request_path).
  """
  @callback page(String.t) :: Thesis.Page.t

  @doc """
  Returns a map consisting of string keys and Thesis.PageContent structs
  for the given Thesis.Page struct. This is generally used to populate the
  page content using the Thesis.View.content/4 function.
  """
  @callback page_contents(Thesis.Page.t) :: %{String.t => Thesis.PageContent.t}

  @doc """
  Updates the given page (identified by its slug) with the given map of
  string keys and Thesis.PageContent structs. Returns `:ok`.

      update(%{"slug" => "/"}, %{"Heading" => "My Heading Content"})
  """
  @callback update(%{String.t => String.t}, map) :: atom
end
