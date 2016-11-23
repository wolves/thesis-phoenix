defmodule Thesis.File do
  @moduledoc """
  Represents a file.
  """
  use Ecto.Schema
  import Ecto.Changeset, only: [cast: 3, validate_required: 2]
  import Thesis.Utilities
  import Thesis.Utilities

  @type t :: %Thesis.File{
    id: any,
    slug: String.t,
    content_type: String.t,
    filename: String.t,
    data: any,
    inserted_at: any,
    updated_at: any
  }

  schema "thesis_files" do
    field :slug, :string
    field :content_type, :string
    field :filename, :string
    field :data, :binary

    timestamps
  end

  @valid_attributes [:slug, :content_type, :filename, :data]
  @required_attributes [:slug, :content_type, :filename, :data]

  @doc """
  Changeset for File structs.
  """
  def changeset(file, %Plug.Upload{} = f) do
    file
    |> cast(%{content_type: f.content_type}, [:content_type])
    |> cast(%{filename: f.filename}, [:filename])
    |> cast(%{data: File.read!(f.path)}, [:data])
    |> cast(%{slug: generate_slug(f.filename)}, [:slug])
    |> validate_required(@required_attributes)
  end

  defp generate_slug(name) do
    random_string(10) <> "-" <> parameterize(name)
  end
end
