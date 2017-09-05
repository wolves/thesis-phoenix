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

  @doc """
  Changeset for Backup structs.
  """
  def changeset(backup, params \\ %{}) do
    backup
    |> cast(params, @valid_attributes)
    |> validate_required(@required_attributes)
  end

  @doc """
  Formats a given Backup with a pretty_date field.

  iex> backup = %Thesis.Backup{ inserted_at: Ecto.DateTime.cast!("2017-09-01T14:00:00Z") }
  iex> b = Thesis.Backup.with_pretty_datetime(backup)
  iex> b.pretty_date
  "9-1-2017 @ 14:00"
  """
  def with_pretty_datetime(backup) do
    {{year, month, day}, {hour, minute, _}} =
      NaiveDateTime.to_erl(backup.inserted_at)
    pretty_date = "#{month}-#{day}-#{year} @ #{hour}:" <>
      (minute < 10 && "0" || "") <> "#{minute}"
    Map.merge(backup, %{pretty_date: pretty_date})
  end

end
