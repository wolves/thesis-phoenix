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
end
