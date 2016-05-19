defmodule Thesis.PageContent do
  use Ecto.Schema

  @type t :: %Thesis.PageContent{
    id: any,
    page_id: integer,
    name: String.t,
    content: String.t | nil,
    content_type: String.t | nil,
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
  def meta_serialize(map) when is_map(map) do
    map
    |> Poison.encode!
  end
end
