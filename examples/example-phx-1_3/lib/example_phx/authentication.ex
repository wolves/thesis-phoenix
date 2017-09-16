# This is a simple hack for a login system.
# It just sets a cookie true or false in the response.
# If you want a secure website, use something like
# guardian, coherence, ueberauth, or roll your own.
defmodule ExamplePhx.Authentication do  
  def logged_in?(conn) do
    conn.cookies["loginstatus"] == "true"
  end

  def login(conn), do: do_login(conn, "true")
  def logout(conn), do: do_login(conn, "false")

  defp do_login(conn, status) do
    week = 7 * 24 * 60 * 60

    conn
    |> Plug.Conn.put_resp_cookie("loginstatus", status, max_age: week)
  end
end