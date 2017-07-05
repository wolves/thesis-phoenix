defmodule Thesis.ApiView do
  use Thesis.View, :view


  def render("page.json", %{thesis_page: page} = assigns) do
    %{
      id: page.id,
      slug: page.slug,
      title: page.title,
      redirect_url: page.redirect_url,
      page_contents: render("page_contents.json", assigns[:page_contents]),
      inserted_at: page.inserted_at,
      updated_at: page.updated_at
    }
  end
  def render("page.json", nil), do: %{}

  def render("page_contents.json", page_contents)
  when is_nil(page_contents), do: []
  def render("page_contents.json", page_contents) when is_list(page_contents) do
    Enum.map(page_contents, fn(page_content) ->
        render("page_content.json", page_content)
      end)
  end

  def render("page_content.json", page_content) do
    %{
      id: page_content.id,
      page_id: page_content.page_id,
      name: page_content.name,
      content: page_content.content,
      content_type: page_content.content_type,
      meta: page_content.meta,
      inserted_at: page_content.inserted_at,
      updated_at: page_content.updated_at
    }
  end
end