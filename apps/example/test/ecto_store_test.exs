defmodule EctoStoreTest do
  use Example.ConnCase

  import Example.MockData

  alias Thesis.Page
  alias Thesis.PageContent

  @store Thesis.Config.store

  defp random_slug, do: :crypto.strong_rand_bytes(10) |> Base.url_encode64 |> binary_part(0, 10)
  defp last_updated(model), do: Repo.one(from x in model, order_by: [desc: x.updated_at])
  defp last_updated(model, limit), do: Repo.all(from x in model, order_by: [desc: x.updated_at], limit: ^limit)

  test "Save content to a page not edited before" do
    slug = random_slug
    last_pc_id = last_updated(PageContent) && last_updated(PageContent) || 0

    :ok = @store.update(valid_static_page(slug), [valid_text_page_content])

    assert last_updated(Page).slug == "/" <> slug
    assert last_updated(PageContent).id > last_pc_id
  end

  test "Save global content to a page not edited before" do
    slug = random_slug

    :ok = @store.update(valid_static_page(slug), [valid_global_content])

    assert last_updated(Page).slug == "/" <> slug
    assert last_updated(PageContent).page_id == nil
  end

  test "Save more than one areas at the same time" do
    :ok = @store.update(valid_static_page, [valid_text_page_content, valid_html_page_content, valid_global_content])

    assert last_updated(Page).slug == valid_static_page["slug"]
    last_3 = last_updated(PageContent, 3)
    assert Enum.at(last_3, 0).content_type == "text"
    assert Enum.at(last_3, 1).content_type == "html"
    assert Enum.at(last_3, 2).content_type == "raw_html"
  end

  test "Save global area on one page; retrieve on a different page that's not yet in database" do
    :ok = @store.update(valid_static_page, [valid_global_content])

    records = @store.page_contents("/" <> random_slug)

    assert records == last_updated(PageContent, 1)
    assert Enum.at(records, 0).content_type == "raw_html"
  end

  test "Retrieves page content as well as well as global content saved on a different page" do
    slug = random_slug
    :ok = @store.update(valid_static_page(random_slug), [valid_global_content])
    :ok = @store.update(valid_static_page(slug), [valid_html_page_content])

    records = @store.page_contents("/" <> slug)

    assert records == last_updated(PageContent, 2)
  end

  test "First adds page, then deletes page found by slug" do
    slug = random_slug
    :ok = @store.update(valid_static_page(slug), [valid_html_page_content])

    assert @store.page("/" <> slug).slug == "/" <> slug
    assert last_updated(Page).slug == "/" <> slug

    :ok = @store.delete(valid_static_page(slug))

    refute @store.page("/" <> slug)
  end

end
