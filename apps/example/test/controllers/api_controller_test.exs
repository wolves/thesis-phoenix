defmodule Example.ApiControllerTest do
  use Example.ConnCase

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

end
