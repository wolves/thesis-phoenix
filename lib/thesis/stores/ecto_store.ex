defmodule Thesis.EctoStore do
  @moduledoc """
  Thesis.EctoStore is the most commonly-used store for Thesis pages and content.
  It interfaces with the host application's repo (which is provided in the
  config.exs of the host applicaton).

  You can generally just use Thesis.EctoStore unless you're not using Ecto in
  your project or you want to do something custom with how Thesis is handling
  its data.
  """

  @behaviour Thesis.Store

  import Thesis.Config
  import Ecto.Query, only: [from: 2]
  import Thesis.Utilities
  alias Thesis.{Page, PageContent, File, Backup}

  def page(slug) when is_binary(slug) do
    repo.get_by(Page, slug: slug)
  end

  def restore(id) do
    backup = repo.get(Backup, id)
    Map.merge(backup, %{page_json: LZString.decompress(backup.page_data)})
  end

  def backups(page_slug) when is_binary(page_slug) do
    page = page(page_slug)
    backups(page.id)
  end

  def backups(page_id) when is_integer(page_id) do
    repo.all(
      from b in Backup,
      where: b.page_id == ^page_id,
      order_by: [desc: b.page_revision]
    )
  end

  @doc """
  Calls page_contents/1 passing through either:
  - `nil`, if the Page could not be found (usually means page has not been edited)
  - `%Page{...}` struct, if the Page has already been edited and saved
  """
  def page_contents(slug) when is_binary(slug) do
    page_contents(page(slug))
  end

  @doc """
  Handles `nil` - means page has not been edited yet.
  At this point we only care about retrieving global content.
  """
  def page_contents(nil) do
    repo.all(from pc in PageContent, where: is_nil(pc.page_id))
  end

  @doc """
  Handles `%Page{...}`` struct - means page has been edited and saved.
  Retrieves page content and global content.
  """
  def page_contents(%Page{id: page_id}) do
    repo.all(from pc in PageContent, where: pc.page_id == ^page_id or is_nil(pc.page_id))
  end

  # TODO: Issue #83 - intermittent issue with duplicate content rows
  # We're using `page_content/2` here to be more vigorous about checking for
  # duplicates, but realize that it's an N+1 on save.
  @doc """
  Returns an existing %PageContent{} record or a newly created one with the
  provided page_id and name set.
  """
  def page_content_or_new(page_id, name, _preloaded_contents) do
    # Original (more efficient but buggy code):
    #   page_content = PageContent.find(preloaded_contents, page_id, name) ||
    #     %PageContent{page_id: page_id, name: name}

    page_content(page_id, name) || %PageContent{page_id: page_id, name: name}
  end

  @doc """
  Retrieves a single %PageContent{} (or nil, if it doesn't exist) based on page_id
  and name.
  """
  def page_content(nil, name) do
    repo.one(from pc in PageContent, where: is_nil(pc.page_id) and pc.name == ^name)
  end
  def page_content(page_id, name) do
    repo.get_by(PageContent, page_id: page_id, name: name)
  end

  @doc """
  Retrieves a file by slug.
  """
  def file(nil), do: nil
  def file(""), do: nil
  def file(slug) do
    repo.get_by(File, slug: slug)
  end

  @doc """
  Updates a page and its page_contents and global content areas.
  """
  def update(page_params, contents_params) do
    page = save_page(page_params)
    save_page_contents(page, contents_params)
    backup_page(page, contents_params)
    :ok
  end

  @doc """
  Deletes a given page by slug.
  """
  def delete(%{"slug" => slug}) do
    page = page(slug)
    repo.delete!(page)
    :ok
  end

  defp save_page(%{"slug" => slug} = page_params) do
    page = page(slug) || %Page{slug: slug}
    page_changeset = Page.changeset(page, page_params)
    repo.insert_or_update!(page_changeset)
  end

  defp backup_page(page, page_contents) do
    serialized_page_data = prepare_page_backup_data(page, page_contents)
    save_backup(page.id, serialized_page_data)
    :ok
  end

  defp save_page_contents(nil, _), do: :error
  defp save_page_contents(page, contents_params) do
    preloaded_contents = page_contents(page)

    contents_params
    |> Enum.map(fn(x) -> content_changeset(x, page, preloaded_contents) end)
    |> Enum.each(fn(x) -> repo.insert_or_update!(x) end)

    :ok
  end

  defp save_backup(nil, _), do: :error
  defp save_backup(page_id, page_data) do
    backups = backups(page_id)

    backup_changeset = Backup.changeset(%Backup{}, %{
      page_id: page_id,
      page_revision: new_backup_page_revision(backups),
      page_data:  LZString.compress(page_data)
    })

    repo.insert!(backup_changeset)
    :ok
  end

  defp content_changeset(new_contents, page, preloaded_contents) do
    %{"name" => name, "content" => content, "content_type" => content_type} = new_contents

    page_id = page_id_or_global(new_contents, page)

    existing_page_content = page_content_or_new(page_id, name, preloaded_contents)

    PageContent.changeset(existing_page_content, %{
      content: content,
      content_type: content_type,
      meta: new_contents["meta"]
    })
  end

  defp new_backup_page_revision(nil), do: 1
  defp new_backup_page_revision([]), do: 1
  defp new_backup_page_revision(backups) do
    last = List.first(backups)
    last.page_revision + 1
  end

  defp page_id_or_global(%{"global" => "true"}, _page), do: nil
  defp page_id_or_global(_content, %Page{id: id}), do: id

  defp prepare_page_backup_data(page, page_contents) do
    %{
      "pageSettings" => %{title: page.title, description: page.description},
      "pageContents" => page_contents
    } |> Poison.encode!
  end
end
