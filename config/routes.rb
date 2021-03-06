Rails.application.routes.draw do

  resources :tickets

  resources :users

  resources :items

  resources :welcomes

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'stock#cash'

  get 'cash' => 'stock#cash'

  get 'stock' => 'stock#stock'

  get 'stock/categories' => 'category#index'

  get 'stock/categories/:id' => 'category#show'


  get 'stock/last' => 'stock#stock'

  get 'current_user' => 'logins#current'

  get 'admin' => 'stock#admin'

  get 'admin/reports/:id' => 'report#show'
  get 'admin/reports/:id/json' => 'report#show_json'


  get 'admin/reports' => 'report#index'


  get 'pays' => 'stock#pays'

  get 'events' => 'stock#notes'

  get 'users' => 'stock#users'

  get 'info' => 'stock#info'

  get 'search' => 'stock#search'

  get 'details' => 'stock#details'

  get 'recargas' => 'stock#zmart'

  get 'login' => 'logins#login'

  get 'logout' => 'logins#logout'

  get 'items/:id/delete' => 'items#destroy'

  get 'hole' => 'report#make_reports'

  post 'login' => 'logins#create'

  post 'ticket/save' => 'ticket#save'
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
