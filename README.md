# event-driven-app
## for-dev-test
- terraform ile AWSde gerekli componentler yuklu bir sekilde(docker, docker-compose gibi) yapı olusturmak icin tf-files-for-developers-and-testers klasoru terraform yuklu bir ortamda terraform.tfvars doyasında gerekli degisiklikler(yani AWS keyler ve private key) yapılarak calıstırılıp AWSde yapı olusturulur
- daha sonra development ve test environment icin application-files klasoru indirilip docker-compose dosyasının bulundugu yerde `docker-compose up` komutu calıstırılarak uygulama calıstırılır(compose dosyasıyla gerekli image olusturma ve daha sonra konteynerlerle uygulamayı calıstırma otomatik yapılır)

## kubernetes-cluster
- eger k8s cluster kurulmak istenirse cluster-tf-infrastructure klasoru icindeki terraform dosyası calıstırılarak AWSde bir master ve bir worker nodeden olusan cluster yapısı olusturulur
- daha sonra application-k8s-manifests dosyalarındaki api,consumer ve producer deploymentlerde kullanılacak imageler icin kendi dockerhub repo adresimi belirttim dogrudan bu dosyalar kullanılarak yapı olusturulabilir. Veya istenirse uygulama dosyaları clustere clone yapılıp daha sonra docker imageler clusterda olusturulup kubernetes deploymentlerde kullanılaracak image olarak bunlar gosterilerek de kuberneteste deployment ve service yapısında uygulama calıstırılır

## Prometheus
- prometheus-install.txt dosyasındaki adımlarla clustere prometheus kurup kubernetes metiklerini izleyebilirsiniz
