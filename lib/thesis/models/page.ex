defmodule Thesis.Page do
  use Ecto.Schema

  @type t :: %Thesis.Page{
    id: any,
    slug: String.t,
    title: String.t | nil,
    description: String.t | nil,
    inserted_at: any,
    updated_at: any
  }

  schema "thesis_pages" do
    field :slug, :string
    field :title, :string
    field :description, :string

    timestamps
  end

end
