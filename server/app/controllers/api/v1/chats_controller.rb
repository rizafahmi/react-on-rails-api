class Api::V1::ChatsController < ApplicationController
  def index
    @chats = ChatMessage.all
    render json: @chats
  end
end
