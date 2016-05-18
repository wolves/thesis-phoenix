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
  Returns a keyword list of meta attributes.

  ## Doctests:

      iex> m = %Thesis.PageContent{meta: "test=Thing&test2=123"}
      iex> Thesis.PageContent.meta_attributes(m)
      [{:test, "Thing"}, {:test2, "123"}]
  """
  def meta_attributes(%Thesis.PageContent{} = page_content) do
    page_content.meta
    |> String.split("&")
    |> Enum.map(fn (s) ->
      {key, value} = String.split(s, "=", parts: 2) |> List.to_tuple
      {String.to_atom(key), value}
    end)
  end

  @doc """
  Returns a string, given a keyword list, for storage in the meta field.

  ## Doctests:

      iex> m = [{:test, "Thing"}, {:test2, "123"}]
      iex> Thesis.PageContent.meta_serialize(m)
      "test=Thing&test2=123"
  """
  def meta_serialize(list) when is_list(list) do
    list
    |> Enum.map(fn ({k, v}) -> "#{k}=#{v}" end)
    |> Enum.join("&")
  end
end
