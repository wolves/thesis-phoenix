defmodule Mix.Tasks.Thesis.Install do
  use Mix.Task
  import Mix.Thesis.Utils

  @migrations [
    "create_thesis_tables",
    "add_meta_to_thesis_page_contents",
    "add_indexes_to_tables",
    "add_template_and_redirect_url_to_thesis_pages",
    "change_content_default_for_page_content",
    "create_thesis_files_table",
    "create_thesis_backups_table"
  ]
  @template_files [
    {"priv/templates/thesis.install/thesis_auth.exs", "lib/thesis_auth.ex"}
  ]

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
    thesis_templates()
    thesis_config()
    thesis_web()

    status_msg("done",
      "Now run #{IO.ANSI.blue}mix ecto.migrate#{IO.ANSI.reset} to ensure your database is up to date.")
  end

  @doc false
  def thesis_templates do
    migration_files = @migrations
                      |> Enum.filter(&migration_missing?/1)
                      |> Enum.with_index
                      |> Enum.map(&migration_tuple/1)
    all_templates = @template_files ++ migration_files

    all_templates
    |> Stream.map(&render_eex/1)
    |> Stream.map(&copy_to_target/1)
    |> Stream.run
  end

  @doc false
  def thesis_config do
    status_msg("updating", "config/config.exs")
    dest_file_path = Path.join [File.cwd! | ~w(config config.exs)]
    dest_file_path
    |> File.read!()
    |> insert_thesis()
    |> overwrite_file(dest_file_path)
  end

  @doc false
  def thesis_web do
    status_msg("updating", "web.ex")

    # Phoenix 1.2 style
    phx_12 = "web/web.ex"
    phx_13 = List.first(Path.wildcard("lib/*_web.ex")) || ""

    dest_file_path =
      (File.exists?(phx_12) && phx_12)
      || (File.exists?(phx_13) && phx_13)

    if dest_file_path do
      dest_file_path
      |> File.read!()
      |> insert_controller()
      |> insert_view()
      |> insert_router()
      |> overwrite_file(dest_file_path)
    else
      status_msg("warning", "couldn't find web.ex! See https://github.com/infinitered/thesis-phoenix/blob/master/README_INSTALL.md.")
    end
  end

  defp insert_controller(source) do
    insert_in(source, "controller", "\n      use Thesis.Controller\n")
  end

  defp insert_view(source) do
    insert_in(source, "view", "\n      use Thesis.View\n")
  end

  defp insert_router(source) do
    insert_in(source, "router", "\n      use Thesis.Router\n")
  end

  def insert_in(source, block, insertion) do
    if String.contains?(source, insertion) do
      source
    else
      match =
        Regex.scan(~r/def #{block} do\n\s.+end\n\s*end/Usm, source)
        |> List.flatten
        |> List.first

      if match do
        inserted = String.replace(match, "    end\n  end", "#{insertion}    end\n  end")
        String.replace(source, match, inserted)
      else
        source
      end
    end
  end

  # defp insert_at(source, pattern, inserted) do
  #   if String.contains?(source, inserted) do
  #     source
  #   else
  #     String.replace(source, pattern, pattern <> inserted)
  #   end
  # end

  defp insert_thesis(source) do
    if String.contains? source, "config :thesis," do
      status_msg("skipping", "thesis config. It already exists.")
      :skip
    else
      source <> """

      # Configure thesis content editor
      config :thesis,
        store: Thesis.EctoStore,
        authorization: #{Mix.Phoenix.base}.ThesisAuth,
        uploader: Thesis.RepoUploader
        #  uploader: <MyApp>.<CustomUploaderModule>
        #  uploader: Thesis.OspryUploader
      config :thesis, Thesis.EctoStore, repo: <MyApp>.Repo
      # config :thesis, Thesis.OspryUploader,
      #   ospry_public_key: "pk-prod-asdfasdfasdfasdf"
      # If you want to allow creating dynamic pages:
      # config :thesis, :dynamic_pages,
      #   view: #{Mix.Phoenix.base}.PageView,
      #   templates: ["index.html", "otherview.html"],
      #   not_found_view: #{Mix.Phoenix.base}.ErrorView,
      #   not_found_template: "404.html"
      """
    end
  end

  defp migration_missing?(filename) do
    "priv/repo/migrations"
    |> File.ls!
    |> Enum.all?(fn (f) -> !String.contains?(f, filename) end)
  end

  defp migration_tuple({filename, i}) do
    ts = String.to_integer(timestamp()) + i
    {"priv/templates/thesis.install/#{filename}.exs", "priv/repo/migrations/#{ts}_#{filename}.exs"}
  end
end
