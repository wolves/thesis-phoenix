defmodule Thesis.Page do
  use Ecto.Schema

  schema "thesis_pages" do
    field :slug, :string
    field :title, :string
    field :description, :string

    timestamps
  end

end
