defmodule Thesis.Store do
  import Thesis.Config
  alias Thesis.{ Page, PageContent }

  def pages do
    repo.all(Page)
      |> Map.new(&slug_page_tuple/1)
  end

  def page(slug) when is_binary(slug) do
    repo.get_by(Page, slug: slug)
  end

  def page_contents(%Page{id: page_id}) do
    repo.all(PageContent, page_id: page_id)
      |> Map.new(&name_page_content_tuple/1)
  end

  def page_contents(slug) when is_binary(slug) do
    page_contents(page(slug))
  end

  def page_contents(nil) do
    %{}
  end

  def update(%{"slug" => slug} = page_params, contents_params) do
    page = page(slug) || %Page{slug: slug}
    page_changeset = Ecto.Changeset.cast(page, page_params, [], ~w(title description) )

    repo.insert_or_update!(page_changeset)

    contents = page_contents(page)

    contents_params
      |> Enum.map(fn(x) -> content_changeset(x, page, contents) end)
      |> Enum.map(fn(x) -> repo.insert_or_update!(x) end)

    :ok
  end

  defp content_changeset(%{"name" => name} = content_params, page, contents) do
    content = contents[name] || %PageContent{name: name, page_id: page.id}

    Ecto.Changeset.cast(content, content_params, [], ~w(content content_type))
  end

  defp slug_page_tuple(%Page{slug: slug} = page) do
    {slug, page}
  end

  defp name_page_content_tuple(%PageContent{name: name} = page_content) do
    {name, page_content}
  end
end
