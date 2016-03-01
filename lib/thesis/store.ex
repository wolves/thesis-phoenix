defmodule Thesis.Store do
  import Thesis.Config
  import Phoenix.HTML, only: [safe_to_string: 1]
  alias Thesis.{ Page, PageContent }

  def get_pages do
    repo.all(Page)
  end

  def page_contents(page_id) do
    repo.get_by(PageContent, page_id: page_id)
  end

  def find_or_create_page(slug) do
    repo.get_by(Page, slug: slug) || create_page(slug)
  end

  def find_or_create_page_content(page_id, name, type, opts) do
    repo.get_by(PageContent, page_id: page_id, name: name) ||
      create_page_content(page_id, name, type, opts[:default])
  end

  defp create_page(slug) do
    repo.insert!(%Page{ slug: slug })
  end

  defp create_page_content(page_id, name, type, content) do
    repo.insert!(%PageContent{
      page_id: page_id,
      name: name,
      content_type: to_string(type),
      content: safe_to_string(content)})
  end
end

