defmodule Thesis.Store do
  import Thesis.Config
  import Phoenix.HTML, only: [safe_to_string: 1]
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

  defp slug_page_tuple(%Page{slug: slug} = page) do
    {slug, page}
  end

  defp name_page_content_tuple(%PageContent{name: name} = page_content) do
    {name, page_content}
  end
end
