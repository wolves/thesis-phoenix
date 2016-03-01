defmodule Thesis.PageContent do
  use Ecto.Schema

  schema "thesis_page_contents" do
    belongs_to :page, Thesis.Page

    field :name, :string
    field :content, :string
    field :content_type, :string

    timestamps
  end
end
