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

    timestamps
  end

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

end
