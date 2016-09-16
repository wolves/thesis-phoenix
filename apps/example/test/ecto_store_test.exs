defmodule EctoStoreTest do
  use Example.ConnCase

  # alias Thesis.EctoStore

  test "Save a page to the database with contents" do
    store = Thesis.Config.store

    pc1 = %{"name" => "A", "content_type" => "html", "content" => "<h1>Yay</h1>"}
    pc2 = %{"name" => "B", "content_type" => "text", "content" => "Yo"}
    pc3 = %{"name" => "C", "content_type" => "raw_html", "content" => "Wat", "global" => "true"}

    :ok = store.update(%{"slug" => "/test"}, [pc1, pc2, pc3])

    pc4 = %{"name" => "D", "content_type" => "text", "content" => "Other page"}
    pc5 = %{"name" => "E", "content_type" => "html", "content" => "<p>Other global</p>", "global" => "true"}

    :ok = store.update(%{"slug" => "/asdf"}, [pc4, pc5])

    page1 = store.page("/test")
    assert is_integer(page1.id)
    assert page1.slug == "/test"

    page2 = store.page("/asdf")
    assert is_integer(page2.id)
    assert page2.slug == "/asdf"

    contents = store.page_contents("/test")

    assert Enum.at(contents, 0).content == "<h1>Yay</h1>"
    assert is_integer(Enum.at(contents, 0).page_id)
    assert Enum.at(contents, 1).content == "Yo"
    assert is_integer(Enum.at(contents, 1).page_id)
    assert Enum.at(contents, 2).page_id == nil
    assert Enum.at(contents, 2).content == "Wat"
    assert Enum.at(contents, 3).page_id == nil
    assert Enum.at(contents, 3).content == "<p>Other global</p>"
    assert Enum.count(contents) == 4
  end

end
