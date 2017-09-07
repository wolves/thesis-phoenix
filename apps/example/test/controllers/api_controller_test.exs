defmodule Example.ApiControllerTest do
  use Example.ConnCase

  alias Thesis.{Page, Backup}

  test "POST /thesis/files/import", %{conn: conn} do
    conn = post conn, "/thesis/files/import", %{"image_url" => "https://cdn-images-1.medium.com/max/128/1*rvw4nIKelSPxYYItLDPy_g@2x.png"}
    assert json_response(conn, 200)["path"] =~ ~r(\/thesis\/files\/.*-imported-.*\.png)
  end

  test "POST /thesis/files/upload", %{conn: conn} do
    upload = %Plug.Upload{
      path: "test/support/test.png",
      filename: "test.png",
      content_type: "image/png"
    }

    conn = post conn, "/thesis/files/upload", %{"file" => upload}
    assert json_response(conn, 200)["path"] =~ ~r(\/thesis\/files\/.*-test.png)
  end

  test "GET /thesis/backups/:page_slug", %{conn: conn} do
    {:ok, page} = Example.Repo.insert(%Page{slug: "/something", title: "Something"})

    conn2 = get conn, "/thesis/backups?page_slug=#{page.slug}", %{}
    assert json_response(conn2, 200) == []

    backup_data =
      """
      {"pageSettings":{"slug":"/something","title":"Welcome to Thesis!","description":"This is a sample app for the Thesis CMS","redirect_url":null,"template":null,"origin":"http://localhost:4000"},"pageContents":[{"name":"Header Logo","content_type":"image","content":"https://infinite.red/images/ir-logo.svg","meta":"{\"global\":true}","global":"true"}]}
      """
      |> LZString.compress()

    {:ok, backup} = Example.Repo.insert(%Backup{page_id: page.id, page_revision: 1, page_data: backup_data})
    conn3 = get conn, "/thesis/backups?page_slug=#{page.slug}", %{}

    data =
      conn3
      |> json_response(200)
      |> List.first()

    assert data["id"] == backup.id
    assert data["page_revision"] == 1
    assert data["pretty_date"] =~ " @ "
  end

  test "GET /thesis/restore/:backup_id", %{conn: conn} do
    {:ok, page} = Example.Repo.insert(%Page{slug: "/something", title: "Something"})

    backup_data =
      """
      {"pageSettings":{"slug":"/something","title":"Welcome to Thesis!","description":"This is a sample app for the Thesis CMS","redirect_url":null,"template":null,"origin":"http://localhost:4000"},"pageContents":[{"name":"Header Logo","content_type":"image","content":"https://infinite.red/images/ir-logo.svg","meta":"{\"global\":true}","global":"true"}]}
      """
      |> LZString.compress()

    {:ok, backup} = Example.Repo.insert(%Backup{page_id: page.id, page_revision: 1, page_data: backup_data})

    conn = get conn, "/thesis/restore/#{backup.id}", %{}

    data = json_response(conn, 200)
    assert data["revision"] == "{\"pageSettings\":{\"slug\":\"/something\",\"title\":\"Welcome to Thesis!\",\"description\":\"This is a sample app for the Thesis CMS\",\"redirect_url\":null,\"template\":null,\"origin\":\"http://localhost:4000\"},\"pageContents\":[{\"name\":\"Header Logo\",\"content_type\":\"image\",\"content\":\"https://infinite.red/images/ir-logo.svg\",\"meta\":\"{\"global\":true}\",\"global\":\"true\"}]}\n"
  end

end
