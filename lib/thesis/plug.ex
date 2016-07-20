# defmodule Thesis.Plug do
#   defmacro __using__(_env) do
#     quote do
#       use Plug.ErrorHandler

#       def call(conn, opts) do
#         try do
#           conn = super(conn, opts)
#         catch
#           kind, %Phoenix.Router.NoRouteError{} = reason ->
#             conn = route_to_dynamic_thesis_page(reason.conn)
#             Plug.ErrorHandler.__catch__(conn, kind, reason, &handle_errors/2)
#         end
#       end

#       defp route_to_dynamic_thesis_page(conn) do
#         conn =
#       end

#       defp handle_errors(conn, %{reason: %Phoenix.Router.NoRouteError{} = reason}) do
#         send_resp(conn, conn.status, "Can't find that page")
#       end
#     end
#   end
# end
