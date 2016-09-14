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

  def page_contents(slug) when is_binary(slug) do
    page_contents(page(slug))
  end

  def page_contents(nil) do
    repo.all(PageContent, page_id: nil)
  end

  def page_contents(%Page{id: page_id}) do
    repo.all(PageContent, page_id: page_id)
  end

  def update(%{"slug" => slug} = page_params, contents_params) do
    page = page(slug) || %Page{slug: slug}
    page_changeset = Ecto.Changeset.cast(page, page_params, [], ~w(slug title description redirect_url template))

    repo.insert_or_update!(page_changeset)

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
