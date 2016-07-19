defmodule Mix.Tasks.Thesis.Install do
  use Mix.Task
  import Mix.Thesis.Utils

  @shortdoc "Generates Thesis code in your Phoenix app"

  @moduledoc """
  Installs Thesis by adding these to your host app:

  * lib/thesis_auth.ex - Contains a function to handle authorization
  * migration - creates the two tables needed for Thesis.EctoStore
  * config/config.exs - adds Thesis config code
  * web/web.ex - adds Thesis `use` statements

  You should be able to run this mix task multiple times without harm. It will
  automatically detect when a file or line of code exists and skip that step.
  """

  @doc false
  def run(_args) do
    thesis_templates
    thesis_config
    thesis_web

    status_msg("done",
      "Now run #{IO.ANSI.blue}mix ecto.migrate#{IO.ANSI.reset} to ensure your database is up to date.")
  end

  @doc false
  def thesis_templates do
    migrations = ["create_thesis_tables", "add_meta_to_thesis_page_contents"]
    migration_files = migrations
                      |> Enum.filter(&migration_missing?/1)
                      |> Enum.with_index
                      |> Enum.map(&migration_tuple/1)

    template_files = [ {"priv/templates/thesis.install/thesis_auth.exs", "lib/thesis_auth.ex" } ]

    template_files ++ migration_files
    |> Stream.map(&render_eex/1)
    |> Stream.map(&copy_to_target/1)
    |> Stream.run
  end

  @doc false
  def thesis_config do
    status_msg("updating", "config/config.exs")
    dest_file_path = Path.join [File.cwd! | ~w(config config.exs)]
    File.read!(dest_file_path)
    |> insert_thesis
    |> overwrite_file(dest_file_path)
  end

  @doc false
  def thesis_web do
    status_msg("updating", "web/web.exs")
    dest_file_path = Path.join [File.cwd! | ~w(web web.ex)]
    File.read!(dest_file_path)
    |> insert_controller
    |> insert_view
    |> insert_router
    |> overwrite_file(dest_file_path)
  end

  defp insert_controller(source) do
    insert_at(source, "use Phoenix.Controller\n", "\n      use Thesis.Controller\n")
  end

  defp insert_view(source) do
    insert_at(source, "use Phoenix.View, root: \"web/templates\"\n", "\n      use Thesis.View\n")
  end

  defp insert_router(source) do
    insert_at(source, "use Phoenix.Router\n", "\n      use Thesis.Router\n")
  end

  defp insert_at(source, pattern, inserted) do
    unless String.contains?(source, inserted) do
      String.replace(source, pattern, pattern <> inserted)
    else
      source
    end
  end

  defp insert_thesis(source) do
    unless String.contains? source, "config :thesis" do
      source <> """

      # Configure thesis content editor
      config :thesis,
        store: Thesis.EctoStore,
        authorization: #{Mix.Phoenix.base}.ThesisAuth
      config :thesis, Thesis.EctoStore, repo: #{Mix.Phoenix.base}.Repo
      """
    else
      status_msg("skipping", "thesis config. It already exists.")
      :skip
    end
  end

  defp migration_missing?(filename) do
    "priv/repo/migrations"
    |> File.ls!
    |> Enum.all?(fn (f) -> !String.contains?(f, filename) end)
  end

  defp migration_tuple({filename, i}) do
    ts = String.to_integer(timestamp) + i
    {"priv/templates/thesis.install/#{filename}.exs", "priv/repo/migrations/#{ts}_#{filename}.exs"}
  end
end
