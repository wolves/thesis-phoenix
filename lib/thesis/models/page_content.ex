defmodule Thesis.PageContent do
  @moduledoc """
  Content areas for a specific page. Includes meta information about the type
  of content as well as other info for specific content blocks.
  """

  use Ecto.Schema
  import Ecto.Changeset

  @type t :: %Thesis.PageContent{
    id: any,
    page_id: integer,
    name: String.t,
    content: String.t | nil,
    content_type: String.t | nil,
    meta: String.t | nil,
    inserted_at: any,
    updated_at: any
  }

  schema "thesis_page_contents" do
    belongs_to :page, Thesis.Page

    field :name, :string
    field :content, :string
    field :content_type, :string
    field :meta, :string

    timestamps
  end

  @valid_attributes [:page_id, :name, :content, :content_type, :meta]
  @required_attributes [:name, :content_type]

  @doc """
  Selects the right page content from a list.

      iex> foo = [%Thesis.PageContent{id: 1, page_id: nil, name: "Test"},%Thesis.PageContent{id: 2, page_id: 1, name: "Test"},%Thesis.PageContent{id: 3, page_id: 2, name: "Test"},%Thesis.PageContent{id: 4, page_id: nil, name: "Test2"},%Thesis.PageContent{id: 5, page_id: 1, name: "Test2"}]
      iex> Thesis.PageContent.find(foo, nil, "Test").id == 1
      true
      iex> Thesis.PageContent.find(foo, 1, "Test").id == 2
      true
      iex> Thesis.PageContent.find(foo, 2, "Test").id == 3
      true
      iex> Thesis.PageContent.find(foo, nil, "Test2").id == 4
      true
      iex> Thesis.PageContent.find(foo, 1, "Test2").id == 5
      true
      iex> Thesis.PageContent.find(foo, 1, "Test7")
      nil
  """

  def find(contents, page_id, name) do
    contents
    |> Enum.find(fn c -> c.name == name && c.page_id == page_id end)
  end

  @doc """
  Returns a keyword list of meta attributes from the serialized data.
  ## Doctests:

      iex> m = %Thesis.PageContent{meta: ~S({"test":"Thing", "test2":"123"})}
      iex> Thesis.PageContent.meta_attributes(m)
      %{test: "Thing", test2: "123"}
  """
  def meta_attributes(%Thesis.PageContent{meta: nil}), do: []
  def meta_attributes(%Thesis.PageContent{} = page_content) do
    page_content.meta
    |> Poison.decode!(keys: :atoms)
  end

  @doc """
  Returns a serialized string, given a map, for storage in the meta field.

  ## Doctests:

      iex> m = %{test: "Thing", test2: "123"}
      iex> Thesis.PageContent.meta_serialize(m)
      ~S({"test2":"123","test":"Thing"})
  """
  def meta_serialize(keyword_list) when is_list(keyword_list) do
    keyword_list
    |> Enum.into(%{})
    |> meta_serialize
  end

  def meta_serialize(map) when is_map(map) do
    map
    |> Poison.encode!
  end

  @doc """
  Changeset for PageContent structs.
  """
  def changeset(page_content, params \\ %{}) do
    page_content
    |> cast(params, @valid_attributes)
    |> validate_required(@required_attributes)
  end
end
