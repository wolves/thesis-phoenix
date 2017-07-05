defmodule <%= base %>.Repo.Migrations.AddAUniqueIndexOnSlug do
  @moduledoc false
  use Ecto.Migration

  def up do
    # Rreate old non-unique index
    drop index(:thesis_pages, [:slug])

    # Create a Unique Index
    create unique_index(:thesis_pages, [:slug])
  end

  def down do
    # Remove unique index
    drop unique_index(:thesis_pages, :slug)

    # Create old non-unique index
    create index(:thesis_pages, [:slug])
  end
end
