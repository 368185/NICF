# CFDSA - Container for Deployment and Scaling Apps

## Installing Metrics Server

### Copy the metrics-server deployment

Go to [https://github.com/kubernetes-sigs/metrics-server/releases]
(https://github.com/kubernetes-sigs/metrics-server/releases) and download the latest release.
The file should be `components.yaml`.

### Update metrics-server pod
Edit `components.yaml`. Look for the following line:

`image: k8s.gcr.io/metrics-server-amd64:v0.3.1`

and perform the following edits

```yaml
containers:
 name: metrics-server
  image: k8s.gcr.io/metrics-server-amd64:vx.x.x
  imagePullPolicy: IfNotPresent
  args:
  - --cert-dir=/tmp
  - --secure-port=4443
 # add the lines below
  - --kubelet-insecure-tls
  - --kubelet-preferred-address-types=InternalIP
```

Ref [SO: Unable to get pod metrics to use in horizontal pod autoscaling -Kubernetes](https://stackoverflow.com/questions/53538012/unable-to-get-pod-metrics-to-use-in-horizontal-pod-autoscaling-kubernetes)

### Install metrics-server

Install the metrics server in the usual manner

`kubectl apply -f components.yaml`

Verify that metrics-server is deploy with the following

`kubectl get svc/metrics-server -n kube-system`

```
NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                  AGE
kube-dns         ClusterIP   10.245.0.10      <none>        53/UDP,53/TCP,9153/TCP   25h
metrics-server   ClusterIP   10.245.165.141   <none>        443/TCP                  24h
```

Verify that the metrics server is indeed collecting metrics by executing a `top`.

`kubectl top nodes`

```
NAME                   CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   
pool-95hh57dhz-389l6   129m         6%     1857Mi          59%       
pool-95hh57dhz-389lt   136m         6%     1778Mi          57%      
```

Note you may have to wait a minute or two before the stats appear.

## Installing WebUI

WebUI in not installed by default. To install Kubernetes' WebUI, go to the [release page](https://github.com/kubernetes/dashboard/releases) and find the latest (or desired version). Install with `kubectl apply` 

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.x.x/aio/deploy/recommended.yaml`

On a terminal, start a proxy server 

`kubectl proxy`

The WebUI can now be accessed with the following URL

[http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)

![WebUI login](https://chukmunnlee.github.io/images/k8s_webui.png)

### Login to WebUI

Create a service account and give it the `cluster-admin` role (or you can create a role with limited privileges).

```yaml
---
apiVersion: v1
kind: ServiceAccount

metadata:
   name: webui-user
   namespace: kube-system

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding

metadata:
   name: webui-user
   namespace: kube-system

roleRef:
   apiGroup: rbac.authorization.k8s.io
   kind: ClusterRole
   name: cluster-admin

subjects:
- kind: ServiceAccount
  name: webui-user
  namespace: kube-system

```

Create the service account `kubectl apply -f sa.yaml` assuming the file is called `sa.yaml`. 

Get the secret for the service account

`kubectl describe sa/webui-user -n kube-system`

Look for `Mountable secrets`. Copy the secret's name. 

`kubectl describe secret/secret_name_here -n kube-system`

Copy the token value and paste it into the 'Enter token' field.

### Alternative to Web UI

If you are concern about the load WebUI place on your cluster, you can try out-of-cluster tool like [Octant](https://github.com/vmware-tanzu/octant)

## Installing Nginx Ingress Controller

Nginx Ingress controller is deployed using helm. Create a namespace called `nginx-ingress` and deploy the helm chart into the namespace.

`helm install <release name> stable/nginx-ingress --version <version number> -n nginx-ingress`

Verify that a load balancer is provisioned by running the following command

`kubectl get svc -n nginx-ingress`

```
NAME            TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                      AGE
ingress-nginx   LoadBalancer   10.245.17.17   157.230.196.98   80:30077/TCP,443:31512/TCP   21m
```

Note: `EXTERNAL-IP` will show an external IP address once the load balancer has been deployed. A `<pending>` indicates that the cloud provider is still provisioning the load balancer. You can verify the that the load balancer has indeed been provisioned by checking it in your cloud console.
