import Html exposing (Html, div, text, button, i)
import Html.App as App
import Html.Events exposing (onClick)
import Html.Attributes exposing (id, class)
import String
import List

main : Program Never
main =
  App.beginnerProgram {
    model = model
    , view = view
    , update = update
  }


-- MODEL

type alias Model = {
  editing : Bool
  , pageToolsHidden : Bool
  , dynamicEnabled : Bool
  , deleteEnabled : Bool
}

model : Model
model = { editing = False
        , pageToolsHidden = False
        , dynamicEnabled = False
        , deleteEnabled = False }


-- UPDATE

type Msg = ToggleEdit
update msg model =
  case msg of
    ToggleEdit ->
      { model | editing = not model.editing }

thesisButtonClasses model =
  [ "thesis-button"
  , "edit"
  , (if model.editing then "active" else "")
  , (if model.pageToolsHidden then "thesis-page-tools-hidden" else "")
  , (if model.dynamicEnabled then "thesis-add-page-tool-present" else "")
  , (if model.deleteEnabled then "thesis-delete-page-tool-present" else "")
  ] |> List.filter((/=) "")
    |> String.join " "


-- VIEW

view : Model -> Html Msg
view model =
  let
    editClasses = thesisButtonClasses(model)
  in
    div [ id "thesis" ] [
      div [ id "thesis-editor", class "wat" ] [
        div [ onClick ToggleEdit, class editClasses ] [
          div [ class "tooltip" ] [
            text "Edit"
          ],
          i [ class "fa fa-edit fa-2x" ] []
        ]
      ]
    ]

