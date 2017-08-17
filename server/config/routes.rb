Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :chats
    end
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => '/cable'
end
