defmodule Example.Repo.Migrations.AddTemplateAndRedirectUrlToThesisPages do
  use Ecto.Migration

  def change do
    alter table(:thesis_pages) do
      add :template, :string
      add :redirect_url, :string
    end
  end
end
