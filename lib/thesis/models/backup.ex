defmodule Thesis.Backup do
  @moduledoc """
  Represents a page and page_content backup.
  """
  use Ecto.Schema
  import Ecto.Changeset, only: [cast: 3, validate_required: 2]
  # import Thesis.Utilities

  @type t :: %Thesis.Backup{
    id: any,
    page_id: integer,
    page_revision: integer,
    page_data: any,
    inserted_at: any,
    updated_at: any
  }

  schema "thesis_backups" do
    belongs_to :page, Thesis.Page

    field :page_revision, :integer
    field :page_data, :string

    timestamps
  end

  @valid_attributes [:page_id, :page_revision, :page_data]
  @required_attributes [:page_id, :page_revision, :page_data]

  def changeset(backup, params \\ %{}) do
    IO.inspect backup
    # file
    # |> cast(%{data: File.read!(upload.path)}, [:data])
    # |> do_changeset(upload)
  end
  #
  # defp do_changeset(file, changes) do
  #   file
  #   |> cast(%{content_type: changes.content_type}, [:content_type])
  #   |> cast(%{filename: changes.filename}, [:filename])
  #   |> cast(%{slug: generate_slug(changes.filename)}, [:slug])
  #   |> validate_required(@required_attributes)
  # end
  #
  # defp generate_slug(name) do
  #   random_string(10) <> "-" <> parameterize(name)
  # end
end
