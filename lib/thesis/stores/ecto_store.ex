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
  alias Thesis.{Page, PageContent}

  def page(slug) when is_binary(slug) do
    repo.get_by(Page, slug: slug)
  end

  # disabled for now
  # def page_contents(nil), do: []

  # calls function with either the page struct or nil
  def page_contents(slug) when is_binary(slug) do
    page_contents(page(slug))
  end

  # if nil, means page was not edited yet. we only care about retrieving global areas at this point
  def page_contents(nil) do
    repo.all(from pc in PageContent, where: is_nil(pc.page_id))
  end

  # we actually don't need this anymore since we are returning actual table data on line 49 to be used on 52;
  # but, we could return all entries if you want to be safe
  # def page_contents(%Page{id: nil}), do: repo.all(PageContent)

  # if struct, we retrieve page specific data and all global areas
  def page_contents(%Page{id: page_id}) do
    repo.all(from pc in PageContent, where: pc.page_id == ^page_id or is_nil(pc.page_id))
  end

  def update(%{"slug" => slug} = page_params, contents_params) do
    page = page(slug) || %Page{slug: slug}
    page_changeset = Ecto.Changeset.cast(page, page_params, [], ~w(slug title description redirect_url template))

    # need to return the inserted struct because if it's a new page, the id is nil
    page = repo.insert_or_update!(page_changeset)

    contents_params
    |> Enum.map(fn(x) -> content_changeset(x, page, page_contents(page)) end)
    |> Enum.each(fn(x) -> repo.insert_or_update!(x) end)

    :ok
  end

  def delete(%{"slug" => slug}) do
    page = page(slug)
    repo.delete!(page)
    :ok
  end

  defp content_changeset(new_contents, page, preloaded_contents) do
    %{"name" => name, "content" => content, "content_type" => content_type} = new_contents

    page_id = page_id_or_global(new_contents, page)

    page_content = PageContent.find(preloaded_contents, page_id, name) ||
      %PageContent{page_id: page_id, name: name}

    PageContent.changeset(page_content, %{
      content: content,
      content_type: content_type,
      meta: new_contents["meta"]
    })
  end

  defp page_id_or_global(%{"global" => "true"}, _page), do: nil
  defp page_id_or_global(_content, %Page{id: id}), do: id
end
